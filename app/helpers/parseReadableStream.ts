const parseReadableStream = async (
  stream: ReadableStream<Uint8Array<ArrayBufferLike>> | null
) => {
  const response = new Response(stream);
  const data = await response.json(); // Use .text() for plain text
  return data;
};

export default parseReadableStream;
