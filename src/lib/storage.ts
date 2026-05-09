import { supabase } from '@/lib/supabase'

export async function uploadFile(
  file: File,
  bucket: string,
  folder?: string
): Promise<string | null> {
  if (!supabase) return null
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = folder
    ? `${folder}/${crypto.randomUUID()}.${ext}`
    : `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(path, file)
  if (error) return null
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
