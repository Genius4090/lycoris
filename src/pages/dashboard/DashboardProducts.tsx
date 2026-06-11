import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminCreateProduct, adminDeleteProduct, adminFetchProducts,
  adminUpdateProduct, deleteProductImage, uploadProductImage,
} from "../../supabase/adminService";
import type { Product } from "../../@types";
import { ImagePlus, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const empty = { title: "", price: "", stock: "" };

const inp =
  "w-full border border-brownish/40 bg-stonish px-3 py-2 font-sora text-sm text-title outline-none focus:border-brownish/60 transition-colors";

const DashboardProducts = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-products"] });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: adminFetchProducts,
  });

  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingCurrentImageUrl, setEditingCurrentImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setUploadError(t("dashboard.products_errImageType")); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError(t("dashboard.products_errImageSize")); return; }
    setUploadError(null);
    setImageFile(file);
    setRemoveImage(false);
    setImagePreview(URL.createObjectURL(file));
  };

  const resolveImageUrl = async (): Promise<string | null> => {
    if (imageFile) return await uploadProductImage(imageFile);
    if (removeImage) return null;
    return editingCurrentImageUrl ?? null;
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const image_url = await resolveImageUrl();
      await adminCreateProduct({ title: form.title, price: Number(form.price), stock: Number(form.stock), image_url });
    },
    onSuccess: () => {
      invalidate(); setForm(empty); setImageFile(null); setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (imageFile && editingCurrentImageUrl) await deleteProductImage(editingCurrentImageUrl).catch(() => {});
      const image_url = await resolveImageUrl();
      await adminUpdateProduct(editingId!, { title: form.title, price: Number(form.price), stock: Number(form.stock), image_url });
    },
    onSuccess: () => { invalidate(); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminDeleteProduct(id),
    onSuccess: invalidate,
  });

  const resetForm = () => {
    setForm(empty); setEditingId(null); setEditingCurrentImageUrl(null);
    setImageFile(null); setImagePreview(null); setRemoveImage(false); setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id); setEditingCurrentImageUrl(p.image_url);
    setForm({ title: p.title, price: String(p.price), stock: String(p.stock) });
    setImageFile(null); setImagePreview(null); setRemoveImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.stock) return;
    if (!editingId && !imageFile) { setUploadError(t("dashboard.products_errImageRequired")); return; }
    editingId ? updateMutation.mutate() : createMutation.mutate();
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const displayImage = imagePreview ?? (removeImage ? null : editingCurrentImageUrl);

  return (
    <div className="flex flex-col gap-6">

      {/* Form card */}
      <div className="border border-brownish/40 bg-stonish p-6 flex flex-col gap-5">
        <h2 className="font-liter text-title text-base">
          {editingId ? t("dashboard.products_editProduct") : t("dashboard.products_addNew")}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder={t("dashboard.products_titlePlaceholder")} required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={`${inp} col-span-2`}
            />
            <input
              placeholder={t("dashboard.products_pricePlaceholder")}
              type="number" min="0" step="0.01" required
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className={inp}
            />
            <input
              placeholder={t("dashboard.products_stockPlaceholder")}
              type="number" min="0" required
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              className={inp}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 overflow-hidden bg-brownish/10 border border-brownish/20 shrink-0 flex items-center justify-center">
              {displayImage
                ? <img src={displayImage} alt="preview" className="w-full h-full object-cover" />
                : <ImagePlus className="w-5 h-5 text-lightish" />
              }
            </div>
            <div className="flex flex-col gap-1">
              <label className="cursor-pointer font-sora text-xs text-grayish bg-brownish hover:bg-brownish/70 transition-colors px-4 py-2 w-fit">
                {t("dashboard.products_chooseImage")}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <p className="font-sora text-xs text-title">
                {imageFile ? imageFile.name : editingId ? t("dashboard.products_replaceFile") : t("dashboard.products_imageRequired")}
              </p>
              {uploadError && <p className="font-sora text-xs text-pinkish">{uploadError}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit" disabled={isSubmitting}
              className="bg-brownish text-grayish font-sora text-xs tracking-wide py-2.5 px-6 hover:bg-brownish/70 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? t("dashboard.products_saving") : editingId ? t("dashboard.products_saveChanges") : t("dashboard.products_addProduct")}
            </button>
            {editingId && (
              <button
                type="button" onClick={resetForm}
                className="border border-brownish/30 text-textish font-sora text-xs py-2 px-4 hover:border-brownish/60 hover:text-title transition-colors cursor-pointer"
              >
                {t("dashboard.products_cancel")}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table card */}
      <div className="border border-brownish/40 bg-stonish overflow-hidden">
        <div className="px-6 py-4 border-b border-brownish/15 flex items-center gap-2">
          <h3 className="font-liter text-title text-base">{t("dashboard.products_allProducts")}</h3>
          {!isLoading && (
            <span className="font-sora text-[10px] bg-brownish/20 text-brownish px-2 py-0.5">{products.length}</span>
          )}
        </div>

        {isLoading ? (
          <p className="font-sora text-lightish text-sm p-6">{t("dashboard.products_loading")}</p>
        ) : products.length === 0 ? (
          <p className="font-sora text-lightish text-sm p-6">{t("dashboard.products_noProducts")}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-brownish/5 border-b border-brownish/10">
              <tr>
                <th className="text-left font-sora text-[10px] uppercase tracking-widest text-title px-5 py-3 w-16">{t("dashboard.products_imageCol")}</th>
                <th className="text-left font-sora text-[10px] uppercase tracking-widest text-title px-5 py-3">{t("dashboard.products_titleCol")}</th>
                <th className="text-left font-sora text-[10px] uppercase tracking-widest text-title px-5 py-3">{t("dashboard.products_priceCol")}</th>
                <th className="text-left font-sora text-[10px] uppercase tracking-widest text-title px-5 py-3">{t("dashboard.products_stockCol")}</th>
                <th className="px-5 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className={`border-b border-brownish/10 transition-colors ${editingId === p.id ? "bg-brownish/10" : "hover:bg-brownish/5"}`}>
                  <td className="px-5 py-3">
                    <div className="w-10 h-10 overflow-hidden bg-brownish/10 shrink-0">
                      {p.image_url
                        ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-title text-lg">🌸</div>
                      }
                    </div>
                  </td>
                  <td className="px-5 py-3 font-sora text-title">{p.title}</td>
                  <td className="px-5 py-3 font-sora text-title">{p.price} €</td>
                  <td className="px-5 py-3">
                    <span className={`font-sora text-[10px] px-2 py-0.5 ${
                      p.stock === 0 ? "bg-pinkish/10 text-pinkish"
                        : p.stock <= 3 ? "bg-amber-900/30 text-amber-400"
                        : "bg-brownish/20 text-brownish"
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => startEdit(p)} className="text-title hover:text-title transition-colors cursor-pointer" aria-label="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteMutation.mutate(p.id)} disabled={deleteMutation.isPending} className="text-title hover:text-pinkish transition-colors disabled:opacity-40 cursor-pointer" aria-label="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardProducts;
