import { useSelector } from "react-redux";
import { selectCartCount } from "../store/slices/cartSlice";

function CartBadge() {
  const count = useSelector(selectCartCount);

  if (count === 0) return null;

  return <span className="cart-badge">{count}</span>;
}

export default CartBadge;
