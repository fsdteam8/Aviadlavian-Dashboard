export interface Topic {
  _id: string;
  Id: string;
  Name: string;
  Primary_Body_Region: string;
  Secondary_Body_Region: string;
  Acuity: string;
  Age_Group: string;
  Tissue_Type: string[];
  Etiology_Mechanism: string;
  Common_Sports: string[];
  Synonyms_Abbreviations: string[];
  Importance_Level: string;
  Description: string;
  Video_URL: string;
  Tags_Keywords: string[];
}

export interface FlashCard {
  _id: string;
  question: string;
  answer: string;
  topicId: Topic;
  difficulty: "easy" | "medium" | "hard";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardsResponse {
  message: string;
  statusCode: number;
  status: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: FlashCard[];
}
