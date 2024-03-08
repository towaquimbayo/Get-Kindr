declare module 'nodemailer' {
    interface Transporter {
        sendMail(
            mailOptions: SendMailOptions,
            callback?: (error: Error | null, info: SentMessageInfo) => void
        ): void;
    }

    interface SendMailOptions {
        from?: string;
        to: string | string[];
        subject?: string;
        text?: string;
        html?: string;
        // Add more options as needed
    }

    interface SentMessageInfo {
        messageId: string;
        response: string;
    }

    function createTransport(config: any): Transporter;

    // You can also declare other functions and constants as needed

    export {
        Transporter,
        SendMailOptions,
        SentMessageInfo,
        createTransport,
        // Export other types, functions, or constants as needed
    };
}