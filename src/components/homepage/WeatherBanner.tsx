export const revalidate = 1800; // refresh every 30 min

async function fetchMarrakechWeather(): Promise<{ temp: number; code: number } | null> {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=31.6225&longitude=-7.9898&current=temperature_2m,weathercode&timezone=Africa%2FCasablanca',
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      temp: Math.round(data.current.temperature_2m),
      code: data.current.weathercode,
    };
  } catch {
    return null;
  }
}

function weatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 82) return '🌦️';
  return '⛈️';
}

function weatherTip(temp: number, locale: string): string {
  const tips: Record<string, { hot: string; warm: string; mild: string }> = {
    en: { hot: 'Wear light clothing & bring water', warm: 'Comfortable visiting conditions', mild: 'Great day to visit' },
    fr: { hot: 'Vêtements légers & eau conseillés', warm: 'Conditions de visite confortables', mild: 'Excellent moment pour visiter' },
    it: { hot: 'Indossa abiti leggeri e porta acqua', warm: 'Condizioni di visita confortevoli', mild: 'Ottimo momento per visitare' },
    de: { hot: 'Leichte Kleidung & Wasser empfohlen', warm: 'Angenehme Besuchsbedingungen', mild: 'Guter Tag für einen Besuch' },
    es: { hot: 'Ropa ligera y agua recomendados', warm: 'Condiciones de visita cómodas', mild: 'Buen momento para visitar' },
  };
  const t = tips[locale] ?? tips.en;
  if (temp >= 35) return t.hot;
  if (temp >= 25) return t.warm;
  return t.mild;
}

interface Props {
  locale: string;
}

export async function WeatherBanner({ locale }: Props) {
  const weather = await fetchMarrakechWeather();
  if (!weather) return null;

  const { temp, code } = weather;
  const icon = weatherIcon(code);
  const tip = weatherTip(temp, locale);
  const isHot = temp >= 35;

  return (
    <div className={`border-b py-2 px-6 ${isHot ? 'bg-orange-50 border-orange-200' : 'bg-sky-50 border-sky-200'}`}>
      <p className={`max-w-6xl mx-auto text-center text-sm font-medium ${isHot ? 'text-orange-800' : 'text-sky-800'}`}>
        {icon} <strong>Marrakech now: {temp}°C</strong>
        <span className={`mx-2 ${isHot ? 'text-orange-400' : 'text-sky-400'}`}>·</span>
        {tip}
      </p>
    </div>
  );
}
