export function FormatTime(props: { value: Date }) {
  return (
    <>
      {props.value.getDate()}/
      {(props.value.getUTCMonth() + 1).toString().padStart(2, "0")}/
      {props.value.getFullYear()}
    </>
  );
}
