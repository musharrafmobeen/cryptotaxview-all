"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Role = void 0;
var timestamps_entities_1 = require("../../../../../../../../../src/common/entities/timestamps.entities");
var rolepermission_entity_1 = require("../../../../../../../../../src/models/rolepermissions/entities/rolepermission.entity");
var user_entity_1 = require("../../../../../../../../../src/models/users/entities/user.entity");
var typeorm_1 = require("typeorm");
var Role = /** @class */ (function (_super) {
    __extends(Role, _super);
    function Role() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], Role.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 25 })
    ], Role.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 5 })
    ], Role.prototype, "shortcode");
    __decorate([
        (0, typeorm_1.Column)({ type: 'int' })
    ], Role.prototype, "status");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return user_entity_1.User; }, function (user) { return user.role; })
    ], Role.prototype, "user");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return rolepermission_entity_1.Rolepermission; }, function (rolepermission) { return rolepermission.roleid; })
    ], Role.prototype, "rolepermission");
    Role = __decorate([
        (0, typeorm_1.Entity)()
    ], Role);
    return Role;
}(timestamps_entities_1.TimeStamps));
exports.Role = Role;
