"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RolepermissionsService = void 0;
var common_1 = require("@nestjs/common");
var RolepermissionsService = /** @class */ (function () {
    function RolepermissionsService() {
    }
    RolepermissionsService.prototype.create = function (createRolepermissionDto) {
        return 'This action adds a new rolepermission';
    };
    RolepermissionsService.prototype.findAll = function () {
        return "This action returns all rolepermissions";
    };
    RolepermissionsService.prototype.findOne = function (id) {
        return "This action returns a #".concat(id, " rolepermission");
    };
    RolepermissionsService.prototype.update = function (id, updateRolepermissionDto) {
        return "This action updates a #".concat(id, " rolepermission");
    };
    RolepermissionsService.prototype.remove = function (id) {
        return "This action removes a #".concat(id, " rolepermission");
    };
    RolepermissionsService = __decorate([
        (0, common_1.Injectable)()
    ], RolepermissionsService);
    return RolepermissionsService;
}());
exports.RolepermissionsService = RolepermissionsService;
