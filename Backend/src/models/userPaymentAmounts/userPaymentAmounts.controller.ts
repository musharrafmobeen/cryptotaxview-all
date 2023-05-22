import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UserpaymentamountsService } from "./userPaymentAmounts.service";
import { CreateUserpaymentamountsDto } from "./dto/create-userPaymentAmounts.dto";
import { UpdateUserpaymentamountsDto } from "./dto/update-userPaymentAmounts.dto";

@Controller("userPaymentAmounts")
export class UserpaymentamountsController {
  constructor(
    private readonly userPaymentAmountsService: UserpaymentamountsService
  ) {}

  @Post()
  create(@Body() createUserpaymentamountsDto: CreateUserpaymentamountsDto) {
    return this.userPaymentAmountsService.create(createUserpaymentamountsDto);
  }

  @Get()
  findAll() {
    return this.userPaymentAmountsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userPaymentAmountsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUserpaymentamountsDto: UpdateUserpaymentamountsDto
  ) {
    return this.userPaymentAmountsService.update(
      id,
      updateUserpaymentamountsDto
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userPaymentAmountsService.remove(id);
  }
}
