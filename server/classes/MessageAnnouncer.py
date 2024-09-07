import queue

class MessageAnnouncer:
    def __init__(self):
        self.listeners = []

    def listen(self):
        new_queue = queue.Queue(maxsize=30)
        self.listeners.append(new_queue)
        return new_queue
    
    def announce(self, message):
        for i in reversed(range(len(self.listeners))):
            try:
                self.listeners[i].put_nowait(message)
            except queue.Full:
                del self.listeners[i]