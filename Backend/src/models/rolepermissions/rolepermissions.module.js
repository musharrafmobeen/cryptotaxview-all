"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RolepermissionsModule = void 0;
var common_1 = require("@nestjs/common");
var rolepermissions_service_1 = require("./rolepermissions.service");
var rolepermissions_controller_1 = require("./rolepermissions.controller");
var RolepermissionsModule = /** @class */ (function () {
    function RolepermissionsModule() {
    }
    RolepermissionsModule = __decorate([
        (0, common_1.Module)({
            controllers: [rolepermissions_controller_1.RolepermissionsController],
            providers: [rolepermissions_service_1.RolepermissionsService]
        })
    ], RolepermissionsModule);
    return RolepermissionsModule;
}());
exports.RolepermissionsModule = RolepermissionsModule;
