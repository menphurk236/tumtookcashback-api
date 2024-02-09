import { Injectable } from '@nestjs/common';
import { SearchDto } from './dto/search.dto';
import {CustomerRepository} from "../../repositories/customer.repository";

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository:CustomerRepository) {
  }
  async findAll(searchDto: SearchDto): Promise<object> {
    let item = []
    const searchBody = searchDto.search.trim()
    const check = searchBody === 'บริษ' ? false : searchBody !== 'บริษัท'
    const searchExclude = searchBody.split('บริษัท')
    const search = searchExclude.length > 1 ? searchExclude[1].trim().length >= 3 ? searchExclude[1].trim() : null : searchDto.search
    if (searchDto.search.length >= 3 && check) {
      item = await this.customerRepository.searchCustomer(search)
    }
    return {
      item,
    };
  }
}
