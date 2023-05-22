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
exports.Permission = void 0;
var timestamps_entities_1 = require("../../../../../../../../../src/common/entities/timestamps.entities");
var rolepermission_entity_1 = require("../../../../../../../../../src/models/rolepermissions/entities/rolepermission.entity");
var typeorm_1 = require("typeorm");
var Permission = /** @class */ (function (_super) {
    __extends(Permission, _super);
    function Permission() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    ], Permission.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 25 })
    ], Permission.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 10 })
    ], Permission.prototype, "shortcode");
    __decorate([
        (0, typeorm_1.Column)({ type: 'int' })
    ], Permission.prototype, "level");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return rolepermission_entity_1.Rolepermission; }, function (rolepermission) { return rolepermission.permissionid; })
    ], Permission.prototype, "rolepermission");
    Permission = __decorate([
        (0, typeorm_1.Entity)()
    ], Permission);
    return Permission;
}(timestamps_entities_1.TimeStamps));
exports.Permission = Permission;
