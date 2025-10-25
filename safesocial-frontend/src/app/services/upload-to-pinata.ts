export async function uploadToPinataDirect(
  file: File,
  pinataJWT: string,
  pinataGateway?: string
): Promise<{ success: boolean; cid?: string; ipfsUrl?: string; error?: string }> {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const data = new FormData();
  data.append("file", file);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pinataJWT}`,
      },
      body: data,
    });
    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: err };
    }
    const result = await res.json();
    const cid = result.IpfsHash || result.cid || result.hash;
    return {
      success: true,
      cid,
      ipfsUrl: pinataGateway
        ? `https://${pinataGateway}/ipfs/${cid}`
        : result.PinataURL || `https://gateway.pinata.cloud/ipfs/${cid}`,
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Upload failed" };
  }
}