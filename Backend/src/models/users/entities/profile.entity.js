"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Profile = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("./user.entity");
var Profile = /** @class */ (function () {
    function Profile() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], Profile.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 25 })
    ], Profile.prototype, "firstname");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 25 })
    ], Profile.prototype, "lastname");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 25 })
    ], Profile.prototype, "username");
    __decorate([
        (0, typeorm_1.Column)({ type: 'int' })
    ], Profile.prototype, "contact");
    __decorate([
        (0, typeorm_1.Column)({ type: 'int' })
    ], Profile.prototype, "status");
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return user_entity_1.User; }, function (user) { return user.profile; }),
        (0, typeorm_1.JoinColumn)()
    ], Profile.prototype, "user");
    Profile = __decorate([
        (0, typeorm_1.Entity)()
    ], Profile);
    return Profile;
}());
exports.Profile = Profile;
