import Board from "@/components/Board";
import Menu from "@/components/Menu";
import Toolbox from "@/components/Toolbox";

export default function Home() {
  return (
    <main>
      <Menu />
      <Toolbox />
      <Board />
    </main>
  );
}
