import { useQuery, useMutation, InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { TicketDetailComp } from './Components/TicketDetail';
import { CreateTicketModal } from './Components/TicketModal';
import { toast } from 'react-toastify';
export const HomePage = () => {
  const queryClient = useQueryClient()
  const [createTicketModalOpen, setCreateTicketModalOpen] = useState(false)
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/project/653e677c1df38bd7c5421ec9');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    queryKey: ["project"]
  });

  const [ticketStatusChange, setTicketStatusChange] = useState<any>()
  const { mutateAsync } = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("http://localhost:8000/project/653e677c1df38bd7c5421ec9/ticketStatusChange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      console.log(responseData);
      return responseData;
    },
    onSuccess: () => {
      toast("Ticket status changed successfully")
      queryClient.invalidateQueries(["project"] as InvalidateQueryFilters);
    }
  });


  if (isLoading) {
    return <div>Loading...</div>
  }
  if (!data) {
    return <div>Something went wrong</div>
  }

  const handleOnDragEnd = async (result: any) => {
    console.log("hello");
    if (!result.destination) {
      return;
    }
    const sourceColumn = result.source.droppableId;
    const destinationColumn = result.destination.droppableId;
    const taskId = result.draggableId;
    console.log({ sourceColumn, destinationColumn, taskId })
    setTicketStatusChange({
      newStatus: destinationColumn,
      oldStatus: sourceColumn,
      taskId: taskId
    });

    await mutateAsync({
      newStatus: destinationColumn,
      oldStatus: sourceColumn,
      taskId: taskId
    });
  };

  return (
    <div className="AllTickets">
      <div >
        <div className=" bg-blue-500 p-4 flex justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Kanban board</h1>
          </div>
          <div className="isolate flex -space-x-2 overflow-hidden">
            {data?.members?.map((member: any, index: number) => (
              <img
                className={`relative inline-block h-8 w-8 rounded-full ring-2 ring-white`}
                src={member?.profileImage}
                alt=""
                style={{ zIndex: 10 * (data?.members?.length - index) }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex space-x-4 p-4">
        {data && (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {Object.keys(data?.kanban)?.map((ticketsStatus, i) => (
              <Droppable droppableId={ticketsStatus} key={ticketsStatus}>
                {(provided) => (
                  <div
                    className="ticketStatusContainer border p-4 rounded-lg w-[300px]"
                    key={i}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <>
                      <CreateTicketModal projectData={data} />
                      {ticketsStatus}
                    </>
                    <div className="content">
                      {data?.kanban[ticketsStatus]?.map(
                        (ticketDetail: any, idx: any) => (
                          <Draggable
                            key={ticketDetail?._id}
                            draggableId={ticketDetail._id}
                            index={idx}
                          >
                            {(provided) => (
                              <div
                                className="ticketContainer bg-white p-4 rounded mb-4 shadow-md"
                                id={ticketDetail._id}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TicketDetailComp ticketDetail={ticketDetail} />
                              </div>
                            )}
                          </Draggable>
                        )
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        )}
      </div>
    </div>
  );
}

