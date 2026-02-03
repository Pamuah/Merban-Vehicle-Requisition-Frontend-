import { HashLoader } from "react-spinners";

export default function Spinner({ loading }: { loading: boolean }) {
  return (
    <div className="sweet-loading">
      <HashLoader size={50} color="#00643e" loading={loading} />
    </div>
  );
}
