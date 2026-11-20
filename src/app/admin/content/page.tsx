import { ContentImageField } from "@/components/admin/ContentImageField";
import {
  contentFields,
  contentSections,
} from "@/lib/content/catalog";
import { saveContentFieldAction } from "@/lib/content/actions";
import { getContentMap } from "@/lib/content/public-content";

export default async function AdminContentPage() {
  const map = await getContentMap();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl text-brand-navy">Website content</h2>
        <p className="mt-2 text-sm text-brand-slate">
          Edit business details, banners, about copy, services, and images.
          Changes appear on the live public pages.
        </p>
      </div>

      {contentSections.map((section) => {
        const fields = contentFields.filter(
          (field) => field.section === section.id,
        );
        return (
          <section key={section.id} className="space-y-4">
            <h3 className="font-display text-2xl text-brand-navy">
              {section.label}
            </h3>
            <div className="space-y-4">
              {fields.map((field) => {
                const value = map[field.key] ?? field.defaultValue;

                if (field.type === "image") {
                  return (
                    <ContentImageField
                      key={field.key}
                      fieldKey={field.key}
                      label={field.label}
                      hint={field.hint}
                      currentValue={value}
                    />
                  );
                }

                if (field.type === "toggle") {
                  return (
                    <form
                      key={field.key}
                      action={saveContentFieldAction}
                      className="border border-brand-navy/10 bg-white p-5"
                    >
                      <input type="hidden" name="key" value={field.key} />
                      <input type="hidden" name="type" value="toggle" />
                      <label className="flex items-start gap-3 text-sm text-brand-navy">
                        <input
                          type="checkbox"
                          name="value"
                          defaultChecked={value === "true"}
                          className="mt-1 h-4 w-4 border-brand-navy/30 text-brand-pink focus:ring-brand-pink"
                        />
                        <span>
                          <span className="block font-medium">{field.label}</span>
                          {field.hint ? (
                            <span className="mt-1 block text-brand-slate">
                              {field.hint}
                            </span>
                          ) : null}
                        </span>
                      </label>
                      <button
                        type="submit"
                        className="mt-4 inline-flex bg-brand-navy px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-navy-light"
                      >
                        Save
                      </button>
                    </form>
                  );
                }

                return (
                  <form
                    key={field.key}
                    action={saveContentFieldAction}
                    className="border border-brand-navy/10 bg-white p-5"
                  >
                    <input type="hidden" name="key" value={field.key} />
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
                        {field.label}
                      </span>
                      {(field.rows || 1) > 1 ? (
                        <textarea
                          name="value"
                          rows={field.rows}
                          defaultValue={value}
                          className="mt-2 w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-pink"
                        />
                      ) : (
                        <input
                          name="value"
                          defaultValue={value}
                          className="mt-2 w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-pink"
                        />
                      )}
                    </label>
                    <button
                      type="submit"
                      className="mt-4 inline-flex bg-brand-navy px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-navy-light"
                    >
                      Save
                    </button>
                  </form>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
