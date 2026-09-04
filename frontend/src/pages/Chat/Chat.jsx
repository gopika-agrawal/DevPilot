import { useParams } from "react-router-dom";

import ChatView from "../../components/chat/ChatView";
import RequireAuth from "../../components/providers/RequireAuth";

function Chat() {
  const { repoId } = useParams();

  return (
    <RequireAuth>
      <ChatView repoId={repoId} />
    </RequireAuth>
  );
}

export default Chat;
export { Chat };