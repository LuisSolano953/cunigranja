
import DataTable from "./DataTable";
import ModalDialog from "./ModalDialog";

function ContentPage({TitlePage,Data,TitlesTable}) {
    return (
        <>
        <div className="">
            <h1>{TitlePage}</h1>
        </div>
        <div className="mt-20">
            <ModalDialog TitlePage={TitlePage} />
            <DataTable Data={Data} TitlesTable={TitlesTable}/>
        </div>
        </>
      );
}

export default ContentPage;