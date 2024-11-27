import express from "express";
import multer from "multer";
import { atualizarNovoPost, listarPosts, postarNovoPost, uploadImagem } from "../controllers/post.Controller.js";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

// Configura o armazenamento de arquivos enviados pelo usuário
const storage = multer.diskStorage({
  // Define o diretório de destino para os arquivos enviados
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // Define o nome do arquivo no servidor
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Cria uma instância do multer com a configuração de armazenamento
const upload = multer({ dest: "./uploads" , storage});

// Função para configurar as rotas da aplicação
const routes = (app) => {
  // Habilita o parsing de dados JSON no corpo das requisições
  app.use(express.json());
  app.use(cors(corsOptions));

  // Rota GET para listar todos os posts
  // Quando uma requisição GET é feita para a URL '/posts', a função listarPosts é chamada
  app.get("/posts", listarPosts);

  // Rota POST para criar um novo post
  // Quando uma requisição POST é feita para a URL '/posts', a função postarNovoPost é chamada
  app.post("/posts", postarNovoPost);

  // Rota POST para fazer upload de uma imagem
  // Quando uma requisição POST é feita para a URL '/upload', o middleware 'upload.single("imagem")'
  // processa o arquivo enviado e a função uploadImagem é chamada
  app.post("/upload", upload.single("imagem"), uploadImagem);

  app.put("/upload/:id", atualizarNovoPost)
}

export default routes;