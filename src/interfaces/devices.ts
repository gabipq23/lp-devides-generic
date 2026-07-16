export interface IDevicesResponse {
  devices: IDevices[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}
export interface IDevices {
  id: number;
  name: string;
  name2: string;
  brand: string;
  model: string;
  image: string[];
  available_colors: Array<string>;
  type: string;
  price: number;
  price_10x: number;
  price_12x: number;
  price_24x: number;
  sap_code: string;
  technical_sheet?: FichaTecnica;
  stock: number;
  is_new: boolean;
  online: boolean;
  insurance_theft: number;
  insurance_theft_damages: number;
  created_at: string;
  updated_at: string;

  //novos campos
  business_partner: string;
  category: string;
  client_type: string;
  company: string;
  company_id: number;
  landing_page: string;
}

interface FichaTecnica {
  tabela: {
    [categoria: string]: {
      [caracteristica: string]: string;
    };
  };
  Bateria: {
    Tipo: string;
    "Com bateria removível": string;
    "Com carregamento rápido": string;
    "Com carregamento sem fio": string;
  };
  CaracterísticasGerais: {
    Cor: string[];
    Linha: string;
    Marca: string;
    Modelo: string;
    Versões: string;
  };
  CartaoSIM: {
    "Com eSIM": string;
    "É Dual SIM": string;
    "Quantidade de eSIMs": string;
    "Quantidade de ranhuras para cartão SIM": string;
    "Tamanhos de cartão SIM compatíveis": string;
  };
  Conectividade: {
    [key: string]: string;
  };
  Camera: {
    "Com câmera": string;
    "Zoom digital": string;
    "Zoom óptico": string;
    "Com reconhecimento de mão": string;
    "Quantidade de câmeras frontais": string;
    "Quantidade de câmeras traseiras": string;
    "Resolução da câmera frontal principal": string;
    "Resolução da câmera traseira principal": string;
    "Resolução das câmeras traseiras": string;
    "Resolução de vídeo da câmera frontal": string;
    "Resolução de vídeo da câmera traseira": string;
    "Abertura do diafragma da câmera frontal": string;
    "Abertura do diafragma da câmera traseira": string;
    "Características principais das câmeras": string;
  };
  DesignEResistencia: {
    "Classificação IP": string;
    "É resistente ao pó": string;
    "É resistente à água": string;
    "É resistente a salpicos": string;
    "Com teclado QWERTY físico": string;
  };
  Especificacoes: {
    "Ano de lançamento": string;
    "Mês de lançamento": string;
    "Número de homologação da Anatel": string;
  };
  Imagens: string[];
  Memoria: {
    "Memória RAM": string;
    "Memória interna": string;
    "Com ranhura para cartão de memória": string;
  };
  Outros: {
    Fabricante: string;
    "Inclui lápis": string;
    "Resolução da câmera grande-angular": string;
  };
  PesoEDimensoes: {
    Peso: string;
    "Altura x Largura x Profundidade": string;
  };
  Processador: {
    "Modelo de GPU": string;
    "Modelo do processador": string;
    "Quantidade de núcleos do processador": string;
  };
  Seguridade: {
    "Com botão SOS": string;
    "Com reconhecimento facial": string;
    "Com leitor de impressão digital": string;
  };
  Sensores: {
    "Com acelerômetro": string;
    "Com barômetro": string;
    "Com bússola": string;
    "Com giroscópio": string;
    "Com sensor de proximidade": string;
  };
  SistemaOperacional: {
    "Nome do sistema operacional": string;
    "Versão original do sistema operacional": string;
    "Última versão compatível do sistema operacional": string;
  };
  Tela: {
    "Tipo de tela": string;
    "Com tela tátil": string;
    "Tamanho da tela": string;
    "Resolução da tela": string;
    "Pixels por polegada da tela": string;
    "Proporção da tela": string;
    "Tecnologia da tela": string;
    "Tipo de resolução da tela": string;
    "Brilho máximo da tela": string;
    "Com tela dobrável": string;
  };
}
