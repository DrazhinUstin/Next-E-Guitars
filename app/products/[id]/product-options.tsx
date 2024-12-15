import { products } from '@wix/stores';

export default function ProductOptions({
  options,
  selectedOptions,
  onOptionSelected,
}: {
  options: products.ProductOption[];
  selectedOptions: Record<string, string>;
  onOptionSelected: (params: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-5">
      {options.map((option) => (
        <fieldset key={option.name} className="space-y-5">
          <legend className="font-semibold">{option.name}</legend>
          <div className="flex flex-wrap gap-2">
            {option.choices?.map((choice) => (
              <div key={choice.description}>
                <input
                  type="radio"
                  id={choice.description}
                  className="peer hidden"
                  checked={selectedOptions[option.name ?? ''] === choice.description}
                  onChange={() =>
                    onOptionSelected({
                      ...selectedOptions,
                      [option.name ?? '']: choice.description ?? '',
                    })
                  }
                />
                <label
                  htmlFor={choice.description}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-sm border px-2 py-1 peer-checked:border-primary"
                >
                  {option.optionType === products.OptionType.color && (
                    <span
                      className="size-4 rounded-full border"
                      style={{ backgroundColor: choice.value }}
                    />
                  )}
                  {choice.description}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
