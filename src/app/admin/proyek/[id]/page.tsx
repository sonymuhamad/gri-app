export default async function DetailProyekPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <div>
      <h5>Hello from detail proyek Page {id}</h5>
    </div>
  );
}
