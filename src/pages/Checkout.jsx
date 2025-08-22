import CartSection from "../component/CartSection";
import PaymentForm from "../component/PaymentForm";
import Transactions from "../component/Transactions";

export default function Checkout() {
    return (
        <div className="flex gap-4 px-6 md:px-12 lg:px-24 mt-8 font-mulish">
            <CartSection />
            {/* <Transactions /> */}
            <PaymentForm />
        </div>
    )
}