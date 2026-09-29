import { FrenchTestRepository } from "../repositories/french-test.repository.js";
import type { CreateTestResultDto, CreateQuestionDto } from "../types/index.js";

export class FrenchTestService {
  private repo = new FrenchTestRepository();

  // Test Results
  async getAllResults() {
    return this.repo.findAllResults();
  }

  async getResultById(id: number) {
    return this.repo.findResultById(id);
  }

  async createResult(data: CreateTestResultDto) {
    return this.repo.createResult(data);
  }

  async deleteResult(id: number) {
    return this.repo.deleteResult(id);
  }

  // Questions
  async getAllQuestions() {
    return this.repo.findAllQuestions();
  }

  async getQuestionsByCategory(category: string) {
    return this.repo.findQuestionsByCategory(category);
  }

  async createQuestion(data: CreateQuestionDto) {
    return this.repo.createQuestion(data);
  }

  async deleteQuestion(id: number) {
    return this.repo.deleteQuestion(id);
  }
}
