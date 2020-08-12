import { getCustomRepository, getRepository } from 'typeorm';
// import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    // Verifico se a categoria existe.
    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    // Se não existe cria ela
    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    // Cria a transaction
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    // Salva o registro
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
