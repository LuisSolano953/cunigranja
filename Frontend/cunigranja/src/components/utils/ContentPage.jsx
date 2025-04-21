import DataTable from "./DataTable"
import ModalDialog from "./ModalDialog"

function ContentPage({
  TitlePage,
  Data,
  TitlesTable,
  FormPage,
  Actions,
  onDelete,
  onUpdate,
  refreshData,
  endpoint,
  showDeleteButton = true, // Valor predeterminado es true
}) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{TitlePage}</h1>

      <div className="mb-5">
        <ModalDialog TitlePage={TitlePage} FormPage={FormPage} refreshData={refreshData} />
      </div>

      <DataTable
        Data={Data}
        TitlesTable={TitlesTable}
        Actions={Actions}
        onDelete={typeof onDelete === "function" ? onDelete : () => console.warn("onDelete no es una función válida")}
        onUpdate={typeof onUpdate === "function" ? onUpdate : () => console.warn("onUpdate no es una función válida")}
        endpoint={endpoint}
        refreshData={refreshData}
        showDeleteButton={showDeleteButton} // Pasar la prop al DataTable
      />
    </div>
  )
}

export default ContentPage
