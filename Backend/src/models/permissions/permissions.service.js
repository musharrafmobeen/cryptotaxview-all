"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PermissionsService = void 0;
var common_1 = require("@nestjs/common");
var PermissionsService = /** @class */ (function () {
    function PermissionsService() {
    }
    PermissionsService.prototype.create = function (createPermissionDto) {
        return 'This action adds a new permission';
    };
    PermissionsService.prototype.findAll = function () {
        return "This action returns all permissions";
    };
    PermissionsService.prototype.findOne = function (id) {
        return "This action returns a #".concat(id, " permission");
    };
    PermissionsService.prototype.update = function (id, updatePermissionDto) {
        return "This action updates a #".concat(id, " permission");
    };
    PermissionsService.prototype.remove = function (id) {
        return "This action removes a #".concat(id, " permission");
    };
    PermissionsService = __decorate([
        (0, common_1.Injectable)()
    ], PermissionsService);
    return PermissionsService;
}());
exports.PermissionsService = PermissionsService;
