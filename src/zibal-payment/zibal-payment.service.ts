import { BadRequestException, Injectable } from '@nestjs/common';
import axios from "axios";

@Injectable()
export class ZibalPaymentService {

    private basePaymenyUrl: string;
    private readonly merchant: string;
    private readonly callbackUrl: string;

    constructor () {

        this.merchant = "zibal";
        this.callbackUrl = "http://localhost:3000";
        this.basePaymenyUrl = "https://gateway.zibal.ir";

    }

    async requestPayment (amount: number) {

        const requestUrl = `${this.basePaymenyUrl}/v1/request`;
        const payload = { merchant: this.merchant, amount: (amount * 10), callbackUrl: this.callbackUrl }

        const request = await axios.post(requestUrl, payload, { headers: { "Content-Type": "application/json" } });
        if (request.data.result !== 100) {

            console.log(request.data);
            throw new BadRequestException("Something Went wrong while payment");

        }

        return request.data;

    }

}
