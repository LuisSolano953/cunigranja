import DataTable from "./DataTable";
import React from "react";
import ModalDialog from "./ModalDialog";




function ContentPage({ TitlePage, Data, TitlesTable, FormPage, Actions, onDelete, endpoint }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{TitlePage}</h1>
      <div className="mb-5">
                    <ModalDialog TitlePage={TitlePage} FormPage={FormPage} />
        </div>
      <DataTable 
        Data={Data} 
        TitlesTable={TitlesTable} 
        Actions={Actions}
        onDelete={onDelete}
        endpoint={endpoint}
      />
    </div>
  );
}

export default ContentPage;



