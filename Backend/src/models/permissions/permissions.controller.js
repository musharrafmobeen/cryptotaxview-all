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
exports.PermissionsController = void 0;
var common_1 = require("@nestjs/common");
var PermissionsController = /** @class */ (function () {
    function PermissionsController(permissionsService) {
        this.permissionsService = permissionsService;
    }
    PermissionsController.prototype.create = function (createPermissionDto) {
        return this.permissionsService.create(createPermissionDto);
    };
    PermissionsController.prototype.findAll = function () {
        return this.permissionsService.findAll();
    };
    PermissionsController.prototype.findOne = function (id) {
        return this.permissionsService.findOne(+id);
    };
    PermissionsController.prototype.update = function (id, updatePermissionDto) {
        return this.permissionsService.update(+id, updatePermissionDto);
    };
    PermissionsController.prototype.remove = function (id) {
        return this.permissionsService.remove(+id);
    };
    __decorate([
        (0, common_1.Post)(),
        __param(0, (0, common_1.Body)())
    ], PermissionsController.prototype, "create");
    __decorate([
        (0, common_1.Get)()
    ], PermissionsController.prototype, "findAll");
    __decorate([
        (0, common_1.Get)(':id'),
        __param(0, (0, common_1.Param)('id'))
    ], PermissionsController.prototype, "findOne");
    __decorate([
        (0, common_1.Patch)(':id'),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)())
    ], PermissionsController.prototype, "update");
    __decorate([
        (0, common_1.Delete)(':id'),
        __param(0, (0, common_1.Param)('id'))
    ], PermissionsController.prototype, "remove");
    PermissionsController = __decorate([
        (0, common_1.Controller)('permissions')
    ], PermissionsController);
    return PermissionsController;
}());
exports.PermissionsController = PermissionsController;
