import React from 'react';
import ConversationList from './components/ConversationList';
import ConversationChat from './components/ConversationChat';

function ConversationPage() {
  return (
    <div className="flex size-full gap-2">
      <section className="basis-[20rem]">
        <ConversationList />
      </section>
      <section className="grow">
        <ConversationChat />
      </section>
    </div>
  );
}

export default ConversationPage;
