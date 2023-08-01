#!/usr/bin/env node
const os = require('os');
const sys = require('util');

function main() {
    // Run administrative tasks
    process.env.DJANGO_SETTINGS_MODULE = "community_go.settings";
    try {
        const { executeFromCommandLine } = require('django/core/management');
        executeFromCommandLine(process.argv);
    } catch (exc) {
        throw new Error(
            "Couldn't import Django. Are you sure it's installed and " +
            "available on your PYTHONPATH environment variable? Did you " +
            "forget to activate a virtual environment?"
        );
    }
}

if (require.main === module) {
    main();
}
