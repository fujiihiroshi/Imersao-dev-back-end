import {getTodosPosts, criarPost, atualizarPost} from "../models/postModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função para listar todos os posts
export async function listarPosts(req, res) {
  // Chama a função do modelo para buscar todos os posts do banco de dados
  const posts = await getTodosPosts();
  // Envia uma resposta HTTP com status 200 (OK) e os posts no formato JSON
  res.status(200).json(posts);
};

// Função para criar um novo post
export async function postarNovoPost(req, res) {
  // Obtém os dados do novo post enviados no corpo da requisição
  const novoPost = req.body;
  try {
    // Chama a função do modelo para criar um novo post no banco de dados
    const postCriado = await criarPost(novoPost);
    // Envia uma resposta HTTP com status 200 (OK) e o post criado
    res.status(200).json(postCriado);
  } catch(erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);
    // Envia uma resposta HTTP com status 500 (Erro Interno do Servidor) e uma mensagem de erro genérica
    res.status(500).json({"Erro": "Falha na requisição!"});
  }
}

// Função para fazer upload de uma imagem e criar um novo post
export async function uploadImagem(req, res) {
  // Cria um objeto com os dados do novo post, incluindo o nome original da imagem
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: ""
  };
  try {
    // Chama a função do modelo para criar um novo post no banco de dados
    const postCriado = await criarPost(novoPost);
    // Constrói o novo nome da imagem com o ID do post criado
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    // Move a imagem para a pasta de uploads com o novo nome
    fs.renameSync(req.file.path, imagemAtualizada);
    // Envia uma resposta HTTP com status 200 (OK) e o post criado
    res.status(200).json(postCriado);
  } catch(erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);
    // Envia uma resposta HTTP com status 500 (Erro Interno do Servidor) e uma mensagem de erro genérica
    res.status(500).json({"Erro": "Falha na requisição!"});
  }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem =  `http://localhost:3000/${id}.png`;
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imgBuffer)

        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, novoPost);
        res.status(200).json(postCriado);
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição!"});
    }
}