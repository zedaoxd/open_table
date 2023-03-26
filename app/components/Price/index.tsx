import { Price as P } from "@prisma/client";

export default function Price({ price }: { price: P }) {
  const renderPrice = () => {
    switch (price) {
      case "CHEAP":
        return (
          <>
            <span>$$</span>
            <span className="text-gray-400">$$</span>
          </>
        );
      case "REGULAR":
        return (
          <>
            <span>$$$</span>
            <span className="text-gray-400">$</span>
          </>
        );
      case "EXPENSIVE":
        return (
          <>
            <span>$$$$</span>
            <span className="text-gray-400"></span>
          </>
        );
      default:
        return (
          <>
            <span className="text-gray-400">$$$$</span>
          </>
        );
    }
  };

  return <p className="flex mr-3">{renderPrice()}</p>;
}
