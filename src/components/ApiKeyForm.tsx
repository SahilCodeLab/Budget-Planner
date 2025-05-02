
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { getStoredApiKey, saveApiKey } from '@/utils/weatherApi';

interface ApiKeyFormProps {
  onApiKeySet: () => void;
}

const ApiKeyForm = ({ onApiKeySet }: ApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setShowForm(true);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }
    
    saveApiKey(apiKey);
    toast.success('API key saved successfully');
    setShowForm(false);
    onApiKeySet();
  };

  return (
    <Card className="p-6 max-w-md mx-auto mt-4">
      {!showForm && apiKey ? (
        <div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              API key is set and stored in your browser
            </p>
            <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
              Change
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-center mb-2">
              OpenWeatherMap API Key
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              To use this weather dashboard, you need an API key from OpenWeatherMap. 
              Your key will be stored in your browser and never sent anywhere else.
            </p>
            <p className="text-sm mb-4">
              <a 
                href="https://home.openweathermap.org/users/sign_up" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-weather-purple underline"
              >
                Sign up here
              </a> to get your free API key.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenWeatherMap API key"
              className="w-full"
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>
              Save API Key
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ApiKeyForm;
