"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.RolepermissionsController = void 0;
var common_1 = require("@nestjs/common");
var RolepermissionsController = /** @class */ (function () {
    function RolepermissionsController(rolepermissionsService) {
        this.rolepermissionsService = rolepermissionsService;
    }
    RolepermissionsController.prototype.create = function (createRolepermissionDto) {
        return this.rolepermissionsService.create(createRolepermissionDto);
    };
    RolepermissionsController.prototype.findAll = function () {
        return this.rolepermissionsService.findAll();
    };
    RolepermissionsController.prototype.findOne = function (id) {
        return this.rolepermissionsService.findOne(+id);
    };
    RolepermissionsController.prototype.update = function (id, updateRolepermissionDto) {
        return this.rolepermissionsService.update(+id, updateRolepermissionDto);
    };
    RolepermissionsController.prototype.remove = function (id) {
        return this.rolepermissionsService.remove(+id);
    };
    __decorate([
        (0, common_1.Post)(),
        __param(0, (0, common_1.Body)())
    ], RolepermissionsController.prototype, "create");
    __decorate([
        (0, common_1.Get)()
    ], RolepermissionsController.prototype, "findAll");
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id'))
    ], RolepermissionsController.prototype, "findOne");
    __decorate([
        (0, common_1.Patch)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)())
    ], RolepermissionsController.prototype, "update");
    __decorate([
        (0, common_1.Delete)(':id'),
        __param(0, (0, common_1.Param)('id'))
    ], RolepermissionsController.prototype, "remove");
    RolepermissionsController = __decorate([
        (0, common_1.Controller)('rolepermissions')
    ], RolepermissionsController);
    return RolepermissionsController;
}());
exports.RolepermissionsController = RolepermissionsController;
