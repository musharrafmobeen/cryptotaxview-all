"use strict";
exports.__esModule = true;
exports.userProviders = void 0;
var profile_entity_1 = require("./entities/profile.entity");
var user_entity_1 = require("./entities/user.entity");
exports.userProviders = [
    {
        provide: 'USER_REPOSITORY',
        useFactory: function (connection) { return connection.getRepository(user_entity_1.User); },
        inject: ['DATABASE_CONNECTION']
    },
    {
        provide: 'PROFILE_REPOSITORY',
        useFactory: function (connection) { return connection.getRepository(profile_entity_1.Profile); },
        inject: ['DATABASE_CONNECTION']
    },
];
