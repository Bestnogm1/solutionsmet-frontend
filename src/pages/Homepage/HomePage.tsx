import { QueryClient, useQuery } from '@tanstack/react-query';
import { useMutation } from 'react-query';

import { useState } from 'react';
import { Button } from '../../@/components/ui/button';
import fakeData from '../../fakeData.json'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { TicketDetailComp } from './Components/TicketDetail';
import { CreateTicketModal } from './Components/TicketModal';
export const HomePage = () => {
  const [createTicketModalOpen, setCreateTicketModalOpen] = useState(false)
  const [projectData, setProjectData] = useState<any>(fakeData)
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/user/all');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    queryKey: ["users"]
  });
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (!data) {
    console.log(data)
    return <div>Something went wrong</div>
  }
  const handleOnDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const sourceColumn = result.source.droppableId;
    const destinationColumn = result.destination.droppableId;
    const taskId = result.draggableId;

    const draggedTask = projectData.kanban[sourceColumn].find(
      (task: any) => task._id === taskId
    );

    if (draggedTask) {
      const sourceColumnIndex = projectData.kanban[sourceColumn].indexOf(
        draggedTask
      );
      projectData.kanban[sourceColumn].splice(sourceColumnIndex, 1);

      projectData.kanban[destinationColumn].splice(
        result.destination.index,
        0,
        draggedTask
      );
      setProjectData({ ...projectData });
    }
  };
  console.log(projectData)
  return (
    <div className="AllTickets">
      <div >
        <div className=" bg-blue-500 p-4 flex justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Kanban board</h1>
          </div>
          <div className="isolate flex -space-x-2 overflow-hidden">
            {projectData.members.map((member: any, index: number) => (
              <img
                className={`relative inline-block h-8 w-8 rounded-full ring-2 ring-white`}
                src={member.profileImage}
                alt=""
                style={{ zIndex: 10 * (projectData.members.length - index) }}
              />
            ))}
          </div>

        </div>
      </div>
      <div className="flex space-x-4 p-4">
        {projectData && (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            {Object.keys(projectData.kanban)?.map((ticketsStatus, i) => (
              <Droppable droppableId={ticketsStatus} key={ticketsStatus}>
                {(provided) => (
                  <div
                    className="ticketStatusContainer border p-4 rounded-lg"
                    key={i}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <div className="font-semibold mb-4">
                    </div>
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded-full mb-4"
                      onClick={() => {
                        setCreateTicketModalOpen(true)
                      }}
                    >
                      Create Task
                    </button>
                    <CreateTicketModal isOpen={createTicketModalOpen}
                      setIsOpen={setCreateTicketModalOpen} />
                    <div className="content">
                      {projectData.kanban[ticketsStatus]?.map(
                        (ticketDetail: any, idx: any) => (
                          <Draggable
                            key={ticketDetail._id}
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
                                <div>
                                  <h2 className="font-semibold text-lg mb-2">
                                    {ticketDetail.ticketTitle}
                                  </h2>
                                  <p className="text-gray-700">
                                    {ticketDetail.description}
                                  </p>
                                </div>
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

