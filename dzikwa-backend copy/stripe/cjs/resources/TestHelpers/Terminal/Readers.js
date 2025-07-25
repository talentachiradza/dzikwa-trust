"use strict";
// File generated from our OpenAPI spec
Object.defineProperty(exports, "__esModule", { value: true });
exports.Readers = void 0;
const StripeResource_js_1 = require("../../../StripeResource.js");
const stripeMethod = StripeResource_js_1.StripeResource.method;
exports.Readers = StripeResource_js_1.StripeResource.extend({
    presentPaymentMethod: stripeMethod({
        method: 'POST',
        fullPath: '/v1/test_helpers/terminal/readers/{reader}/present_payment_method',
    }),
    succeedInputCollection: stripeMethod({
        method: 'POST',
        fullPath: '/v1/test_helpers/terminal/readers/{reader}/succeed_input_collection',
    }),
    timeoutInputCollection: stripeMethod({
        method: 'POST',
        fullPath: '/v1/test_helpers/terminal/readers/{reader}/timeout_input_collection',
    }),
});
