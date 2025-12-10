import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Scale, ArrowDown, ArrowUp, Calculator } from "lucide-react";

interface WeighbridgeData {
  entryWeight: number;
  exitWeight: number;
  tareWeight?: number;
}

interface WeighbridgeIntegrationProps {
  vehicleNumber: string;
  type: "entry" | "exit";
  currentWeight?: number;
  entryWeight?: number;
  onWeightCapture: (weight: number) => void;
}

export const WeighbridgeIntegration = ({
  vehicleNumber,
  type,
  currentWeight,
  entryWeight,
  onWeightCapture,
}: WeighbridgeIntegrationProps) => {
  const [weight, setWeight] = useState<string>(currentWeight?.toString() || "");
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateWeighbridge = () => {
    setIsSimulating(true);
    // Simulate weighbridge reading with random weight
    setTimeout(() => {
      const simulatedWeight = Math.floor(Math.random() * 20000) + 5000; // 5000-25000 kg
      setWeight(simulatedWeight.toString());
      setIsSimulating(false);
    }, 1500);
  };

  const handleCapture = () => {
    const weightValue = parseFloat(weight);
    if (!isNaN(weightValue) && weightValue > 0) {
      onWeightCapture(weightValue);
    }
  };

  const netWeight = entryWeight && currentWeight 
    ? Math.abs(entryWeight - currentWeight) 
    : null;

  return (
    <Card className="border-2 border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Scale className="h-4 w-4" />
          Weighbridge {type === "entry" ? "Entry" : "Exit"}
        </CardTitle>
        <CardDescription className="text-xs">
          {vehicleNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label className="text-xs">Weight (kg)</Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                kg
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={simulateWeighbridge}
            disabled={isSimulating}
            className="shrink-0"
          >
            {isSimulating ? (
              <span className="animate-pulse">Reading...</span>
            ) : (
              <>
                <Scale className="h-4 w-4 mr-1" />
                Auto Read
              </>
            )}
          </Button>
        </div>

        {type === "exit" && entryWeight && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-500/10 rounded-lg p-2">
              <ArrowDown className="h-4 w-4 mx-auto text-emerald-500 mb-1" />
              <p className="text-xs text-muted-foreground">Entry</p>
              <p className="font-bold text-sm">{entryWeight.toLocaleString()} kg</p>
            </div>
            <div className="bg-orange-500/10 rounded-lg p-2">
              <ArrowUp className="h-4 w-4 mx-auto text-orange-500 mb-1" />
              <p className="text-xs text-muted-foreground">Exit</p>
              <p className="font-bold text-sm">
                {weight ? `${parseFloat(weight).toLocaleString()} kg` : "-"}
              </p>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-2">
              <Calculator className="h-4 w-4 mx-auto text-blue-500 mb-1" />
              <p className="text-xs text-muted-foreground">Net</p>
              <p className="font-bold text-sm">
                {weight && entryWeight
                  ? `${Math.abs(entryWeight - parseFloat(weight)).toLocaleString()} kg`
                  : "-"}
              </p>
            </div>
          </div>
        )}

        <Button
          type="button"
          onClick={handleCapture}
          disabled={!weight || parseFloat(weight) <= 0}
          className="w-full"
        >
          Capture Weight
        </Button>
      </CardContent>
    </Card>
  );
};

// Compact weighbridge input for forms
export const WeighbridgeInput = ({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) => {
  const [isReading, setIsReading] = useState(false);

  const simulateReading = () => {
    setIsReading(true);
    setTimeout(() => {
      const simulatedWeight = Math.floor(Math.random() * 20000) + 5000;
      onChange(simulatedWeight.toString());
      setIsReading(false);
    }, 1000);
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Scale className="h-3 w-3" />
        {label}
      </Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="number"
            placeholder="0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            readOnly={readOnly}
            className="pr-10"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            kg
          </span>
        </div>
        {!readOnly && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={simulateReading}
            disabled={isReading}
            title="Read from weighbridge"
          >
            {isReading ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <Scale className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
