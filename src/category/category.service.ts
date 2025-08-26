import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from '../entities/Category.entity';
import { REPOSITORIES } from '../constants';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(REPOSITORIES.CATEGORY)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const categoryExists = await this.categoryRepository.findOne({ where: { categoryName: createCategoryDto.categoryName } });
    if (categoryExists) {
      throw new ConflictException(`Category with name ${createCategoryDto.categoryName} already exists`);
    }
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ order: { idCategory: "DESC" } });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { idCategory: id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    let category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    if (updateCategoryDto.categoryName && updateCategoryDto.categoryName != category.categoryName) {
      const categoryExists = await this.categoryRepository.findOne({ where: { categoryName: updateCategoryDto.categoryName } });
      if (categoryExists) {
        throw new ConflictException(`Category with name ${updateCategoryDto.categoryName} already exists`);
      }
    }
    category = this.categoryRepository.merge(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.softRemove(category);
  }
}
