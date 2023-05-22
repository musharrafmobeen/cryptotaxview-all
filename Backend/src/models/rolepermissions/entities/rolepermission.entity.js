"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Rolepermission = void 0;
var action_entity_1 = require("../../../../../../../../../src/models/actions/entities/action.entity");
var permission_entity_1 = require("../../../../../../../../../src/models/permissions/entities/permission.entity");
var role_entity_1 = require("../../../../../../../../../src/models/roles/entities/role.entity");
var typeorm_1 = require("typeorm");
var Rolepermission = /** @class */ (function () {
    function Rolepermission() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Rolepermission.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 25 })
    ], Rolepermission.prototype, "shortname");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 10 })
    ], Rolepermission.prototype, "shortcode");
    __decorate([
        (0, typeorm_1.Column)({ type: 'int' })
    ], Rolepermission.prototype, "status");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return role_entity_1.Role; }, function (role) { return role.rolepermission; }),
        (0, typeorm_1.JoinColumn)()
    ], Rolepermission.prototype, "roleid");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return action_entity_1.Action; }, function (action) { return action.rolepermission; }),
        (0, typeorm_1.JoinColumn)()
    ], Rolepermission.prototype, "actionid");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return permission_entity_1.Permission; }, function (permission) { return permission.rolepermission; }),
        (0, typeorm_1.JoinColumn)()
    ], Rolepermission.prototype, "permissionid");
    Rolepermission = __decorate([
        (0, typeorm_1.Entity)()
    ], Rolepermission);
    return Rolepermission;
}());
exports.Rolepermission = Rolepermission;
