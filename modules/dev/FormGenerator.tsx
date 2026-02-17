
import React, { useState } from 'react';

interface FormField {
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  status: 'normal' | 'success' | 'error';
}

export const FormGenerator: React.FC = () => {
  const [fields, setFields] = useState<FormField[]>([
    { label: 'Full Name', type: 'text', placeholder: 'e.g. John Doe', required: true, status: 'normal' },
    { label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true, status: 'normal' },
    { label: 'Message', type: 'text', placeholder: 'How can we help?', required: false, status: 'normal' }
  ]);

  // Styling State
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderRadius, setBorderRadius] = useState(2);
  const [borderColor, setBorderColor] = useState('#262626');
  const [focusColor, setFocusColor] = useState('#ffffff');
  const [hoverColor, setHoverColor] = useState('#404040');
  const [successColor, setSuccessColor] = useState('#22c55e');
  const [errorColor, setErrorColor] = useState('#ef4444');
  const [requiredStarColor, setRequiredStarColor] = useState('#ef4444');
  const [inputBg, setInputBg] = useState('#111111');
  const [inputTextColor, setInputTextColor] = useState('#e5e5e5');
  const [labelColor, setLabelColor] = useState('#a3a3a3');

  const [previewBg, setPreviewBg] = useState<'dark' | 'light'>('dark');

  const addField = () => setFields([...fields, { label: 'New Field', type: 'text', placeholder: '', required: false, status: 'normal' }]);
  const removeField = (i: number) => setFields(fields.filter((_, idx) => idx !== i));
  const updateField = (i: number, key: keyof FormField, value: any) => {
    const newFields = [...fields];
    newFields[i] = { ...newFields[i], [key]: value };
    setFields(newFields);
  };

  const generateHTML = () => {
    return `<form class="swiss-form">
${fields.map(f => `  <div class="form-group">
    <label>${f.label}${f.required ? ' <span class="required">*</span>' : ''}</label>
    <input type="${f.type}" placeholder="${f.placeholder}" ${f.required ? 'required' : ''} class="${f.status !== 'normal' ? 'status-' + f.status : ''}" />
  </div>`).join('\n')}
  <button type="submit">Submit</button>
</form>`;
  };

  const generateCSS = () => {
    return `.swiss-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.05em;
  color: ${labelColor};
}

.required {
  color: ${requiredStarColor};
}

.swiss-form input {
  background: ${inputBg};
  color: ${inputTextColor};
  border: ${borderWidth}px solid ${borderColor};
  border-radius: ${borderRadius}px;
  padding: 0.75rem 1rem;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.swiss-form input:hover {
  border-color: ${hoverColor};
}

.swiss-form input:focus {
  border-color: ${focusColor};
}

.swiss-form input.status-success {
  border-color: ${successColor};
}

.swiss-form input.status-error {
  border-color: ${errorColor};
}

.swiss-form button {
  padding: 1rem;
  background: #ffffff;
  color: #000000;
  border: none;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.2s;
}

.swiss-form button:hover {
  opacity: 0.9;
}`;
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Dynamic Style injection for Preview functionality */}
      <style>{`
        .preview-input {
          transition: all 0.2s ease;
        }
        .preview-input:hover:not(.status-success):not(.status-error) {
          border-color: ${hoverColor} !important;
        }
        .preview-input:focus:not(.status-success):not(.status-error) {
          border-color: ${focusColor} !important;
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        
        {/* Left Sidebar: Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 pb-10">
           
           {/* Section 1: Field Configuration */}
           <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
                <h3 className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Fields Editor</h3>
                <button onClick={addField} className="text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold">+ Add Field</button>
              </div>
              
              <div className="space-y-4">
                {fields.map((f, i) => (
                  <div key={i} className="bg-[var(--bg-input)] border border-[var(--border)] p-4 space-y-4 relative group">
                    <button onClick={() => removeField(i)} className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-red-500 transition-colors">×</button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] uppercase text-[var(--text-muted)] block mb-1">Label</label>
                        <input value={f.label} onChange={(e) => updateField(i, 'label', e.target.value)} className="w-full bg-transparent border-b border-[var(--border)] text-xs text-[var(--text-primary)] outline-none p-1 focus:border-[var(--border-hover)]" />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase text-[var(--text-muted)] block mb-1">Type</label>
                        <select value={f.type} onChange={(e) => updateField(i, 'type', e.target.value)} className="w-full bg-[var(--bg-card)] border border-[var(--border)] p-1 text-[10px] uppercase text-[var(--text-muted)]">
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="password">Password</option>
                          <option value="number">Number</option>
                          <option value="tel">Phone</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase text-[var(--text-muted)] block mb-1">Placeholder</label>
                      <input value={f.placeholder} onChange={(e) => updateField(i, 'placeholder', e.target.value)} className="w-full bg-transparent border-b border-[var(--border)] text-xs text-[var(--text-muted)] outline-none p-1" placeholder="Placeholder hint..." />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={f.required} onChange={(e) => updateField(i, 'required', e.target.checked)} className="accent-white" />
                        <span className="text-[10px] uppercase text-[var(--text-muted)]">Required</span>
                      </label>
                      <div className="flex gap-2">
                         {(['normal', 'success', 'error'] as const).map(s => (
                           <button 
                            key={s} 
                            onClick={() => updateField(i, 'status', s)}
                            className={`text-[9px] uppercase px-1.5 py-0.5 border ${f.status === s ? 'border-white text-[var(--text-primary)]' : 'border-[var(--border)] text-[var(--text-muted)]'}`}
                           >
                             {s}
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           {/* Section 2: Visual Styling */}
           <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
              <h3 className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest border-b border-[var(--border)] pb-2">Global Styling</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <RangeControl label="Border Width" value={borderWidth} min={0} max={10} onChange={setBorderWidth} />
                <RangeControl label="Border Radius" value={borderRadius} min={0} max={40} onChange={setBorderRadius} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ColorControl label="Border Color" value={borderColor} onChange={setBorderColor} />
                <ColorControl label="Focus Color" value={focusColor} onChange={setFocusColor} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ColorControl label="Hover Color" value={hoverColor} onChange={setHoverColor} />
                <ColorControl label="Input BG" value={inputBg} onChange={setInputBg} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <ColorControl label="Success" value={successColor} onChange={setSuccessColor} />
                <ColorControl label="Error" value={errorColor} onChange={setErrorColor} />
                <ColorControl label="Req *" value={requiredStarColor} onChange={setRequiredStarColor} />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-4">
                <ColorControl label="Label Color" value={labelColor} onChange={setLabelColor} />
              </div>
           </div>
        </div>

        {/* Right Area: Preview & Code */}
        <div className="lg:col-span-7 flex flex-col gap-6">
           
           {/* Preview Area */}
           <div className={`flex-1 border border-[var(--border)] relative transition-colors duration-300 ${previewBg === 'dark' ? 'bg-[var(--bg-page)]' : 'bg-[#f5f5f5]'} overflow-y-auto`}>
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] p-1 z-20">
                <button onClick={() => setPreviewBg('dark')} className={`px-3 py-1 text-[9px] uppercase font-bold tracking-widest transition-all ${previewBg === 'dark' ? 'bg-white text-black' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>Dark</button>
                <button onClick={() => setPreviewBg('light')} className={`px-3 py-1 text-[9px] uppercase font-bold tracking-widest transition-all ${previewBg === 'light' ? 'bg-[var(--bg-input)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-black'}`}>Light</button>
              </div>

              <div className="absolute top-4 left-4 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold italic z-20">Preview Canvas</div>

              <div className="flex items-center justify-center min-h-full p-12">
                <div className="w-full max-w-sm flex flex-col gap-6">
                   {fields.map((f, i) => (
                     <div key={i} className="flex flex-col gap-2">
                        <label className="text-xs uppercase font-bold tracking-wider" style={{ color: labelColor }}>
                          {f.label} {f.required && <span style={{ color: requiredStarColor }}>*</span>}
                        </label>
                        <input 
                          type={f.type} 
                          placeholder={f.placeholder} 
                          className={`w-full p-3 text-sm transition-all focus:outline-none placeholder:opacity-30 preview-input ${f.status !== 'normal' ? 'status-' + f.status : ''}`}
                          style={{
                            backgroundColor: inputBg,
                            color: inputTextColor,
                            borderRadius: `${borderRadius}px`,
                            borderWidth: `${borderWidth}px`,
                            borderStyle: 'solid',
                            borderColor: f.status === 'success' ? successColor : f.status === 'error' ? errorColor : borderColor
                          }}
                        />
                     </div>
                   ))}
                   <button 
                    className="w-full py-4 mt-2 font-bold uppercase tracking-widest text-[11px] transition-all hover:opacity-90"
                    style={{ backgroundColor: focusColor, color: inputBg === '#ffffff' ? '#000000' : (focusColor === '#ffffff' ? '#000000' : '#ffffff') }}
                   >
                     Submit Form
                   </button>
                </div>
              </div>
           </div>
           
           {/* Code Output Area */}
           <div className="bg-[var(--bg-card)] border border-[var(--border)]">
              <div className="flex border-b border-[var(--border)]">
                <div className="px-6 py-3 text-[10px] uppercase text-[var(--text-muted)] font-bold border-r border-[var(--border)]">Generated Code</div>
                <div className="flex-1"></div>
                <button onClick={() => navigator.clipboard.writeText(generateHTML() + '\n\n' + generateCSS())} className="px-6 py-3 text-[10px] uppercase text-[var(--text-primary)] font-bold hover:bg-[var(--bg-hover)] transition-colors">Copy Bundle</button>
              </div>
              <div className="grid grid-cols-2 h-48">
                 <div className="border-r border-[var(--border)] overflow-auto">
                    <div className="px-4 py-2 text-[9px] uppercase text-[var(--text-muted)] bg-[var(--bg-input)]/40 border-b border-[var(--border)] font-bold">HTML</div>
                    <code className="block p-4 text-[10px] font-mono text-[var(--text-muted)] whitespace-pre">{generateHTML()}</code>
                 </div>
                 <div className="overflow-auto">
                    <div className="px-4 py-2 text-[9px] uppercase text-[var(--text-muted)] bg-[var(--bg-input)]/40 border-b border-[var(--border)] font-bold">CSS</div>
                    <code className="block p-4 text-[10px] font-mono text-[var(--text-muted)] whitespace-pre">{generateCSS()}</code>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ColorControl = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">{label}</label>
    <div className="flex gap-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 bg-[var(--bg-input)] border border-[var(--border)] p-1 cursor-pointer" />
      <input type="text" value={value.toUpperCase()} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] px-2 text-[10px] text-[var(--text-muted)] font-mono outline-none uppercase" />
    </div>
  </div>
);

const RangeControl = ({ label, value, min, max, step = 1, onChange, unit = 'px' }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; unit?: string }) => (
  <div>
    <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 flex justify-between">{label} <span>{value}{unit}</span></label>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full h-1 bg-[var(--bg-hover)] appearance-none accent-white cursor-pointer" />
  </div>
);
