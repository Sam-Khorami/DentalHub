import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Requests } from '../entity/request.entity';
import { MailService } from '../mail/mail.service';
import { Role } from '../entity/role.entity';
import { UserRole, RequestStatus } from "../enums/entity.enums";
import { AddCategoryDto } from './dto/addCategory.dto';
import { Category } from '../entity/category.entity';
import { Product } from '../entity/product.entity';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { AddProductDto } from './dto/addProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class AdminService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
        @InjectRepository(Requests) private readonly requestsRepo: Repository<Requests>,
        @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        private readonly mailService: MailService

    ) {}

    async getPendingRequests () {

        const requests = await this.requestsRepo.find({ where: { status: RequestStatus.Pending }, relations: { user: true } });
        if (!requests) throw new NotFoundException("Requests Not Found!");

        return requests;

    }

    async getRequests () {

        const requests = await this.requestsRepo.find({ relations: { user: true } });
        if (!requests) throw new NotFoundException("Requests Not Found!");

        return requests;

    }

    async acceptRequest (userId: number, role: UserRole) {

        // Checking User Existing
        const user = await this.userRepo.findOne({ where: { id: userId }, relations: { roles: true } });
        if (!user) throw new NotFoundException("User Not Found!");
        if (user.role !== UserRole.User) throw new BadRequestException("You do not have any access for this operation");

        // Checking User Request 
        const checkRequest = await this.requestsRepo.findOne({ where: { user: { id: userId } } });
        if (!checkRequest || checkRequest.status !== RequestStatus.Pending) throw new BadRequestException("The request for this user does not exists!");

        // Chcking Role Existing
        const checkRole = await this.roleRepo.findOne({ where: { name: role } });
        if (!checkRole) throw new NotFoundException("Role Not Found!");

        // Changing User Table
        user.roles.pop();
        user.role = checkRole.name;
        user.roles.push(checkRole);
        checkRequest.status = RequestStatus.Accepted;
        await this.userRepo.save(user);
        await this.requestsRepo.save(checkRequest);

        // Sending Notfication To User
        await this.mailService.sendEmailToUser(user.email, `Hi dear ${user.username} your request accepted from our admins`)

        return;

    }

    async rejectRequest (userId: number) {

        // Checking User
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found");
        if (user.role !== UserRole.User) throw new BadRequestException("You do not have access for this operation");

        // Checking Request
        const checkRequest = await this.requestsRepo.findOne({ where: { user: { id: userId } } });
        if (!checkRequest || checkRequest.status !== RequestStatus.Pending) throw new BadRequestException("The request for this user does not exists!");

        // Changing table
        checkRequest.status = RequestStatus.Rejected;
        await this.requestsRepo.save(checkRequest);

        // Sending Notfication To User
        await this.mailService.sendEmailToUser(user.email, `Hi dear ${user.username} your request rejected from our admins`)

        return;

    }

    async addCategory (data: AddCategoryDto) {

        const checkCategory = await this.categoryRepo.findOne({ where: { name: data.name } });
        if (checkCategory) throw new ConflictException("Category already exists!"); 

        const newCategory = this.categoryRepo.create({ name: data.name });
        await this.categoryRepo.save(newCategory);
        return;

    }

    async deleteCategory (categoryId: number) {

        const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
        if (!category) throw new NotFoundException("Category Not Found!");

        await this.categoryRepo.remove(category);
        return;

    }

    async updateCategory (categoryId: number, data: UpdateCategoryDto) {

        const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
        if (!category) throw new NotFoundException("Category Not Found!");

        const checkCategory = await this.categoryRepo.findOne({ where: { name: data.name } });
        if (checkCategory) throw new ConflictException("Category with this name already exists!");

        await this.categoryRepo.update({ id: categoryId }, { name: data.name });
        return;

    }

    async getCategories () {

        const categories = await this.categoryRepo.find();
        if (!categories) throw new NotFoundException("Categories Not Found!");

        return categories;

    }

    async addProduct (data: AddProductDto, categoryId: number) {

        const checkProduct = await this.productRepo.findOne({ where: { name: data.name } });
        if (checkProduct) throw new ConflictException("Product already exists!");

        const checkCategory = await this.categoryRepo.findOne({ where: { id: categoryId } });
        if (!checkCategory) throw new NotFoundException("Category Not Found!");

        const newProduct = this.productRepo.create({ name: data.name, description: data.description, category: checkCategory });
        await this.productRepo.save(newProduct);

        return;

    }

    async deleteProduct (productId: number) {

        const checkProduct = await this.productRepo.findOne({ where: { id: productId } });
        if (!checkProduct) throw new NotFoundException("Product Not Found!");    

        await this.productRepo.remove(checkProduct);
        return;

    }

    async updateProduct (productId: number, data: UpdateProductDto) {

        const product = await this.productRepo.findOne({ where: { id: productId } });
        if (!product) throw new NotFoundException("Product Not Found!");

        const checkProduct = await this.productRepo.findOne({ where: { name: data.name } });
        if (checkProduct) throw new ConflictException("Product with this name already exists!");

        await this.productRepo.update({ id: productId }, data);
        return;

    }

    async getProducts () {

        const products = await this.productRepo.find();
        if (!products) throw new NotFoundException("Products Not Found!");
        
        return products;

    }

}
