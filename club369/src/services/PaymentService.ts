export const PaymentService = {
    loadRazorpay: (src: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    },

    initiatePayment: async (options: any): Promise<void> => {
        const isLoaded = await PaymentService.loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
        if (!isLoaded) {
            throw new Error("Razorpay SDK failed to load");
        }

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    }
};
