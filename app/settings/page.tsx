import {
  Container,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import ConnectToWhatsapp from "./ConnectToWhatsapp";
import CreatePost from "./CreatePost";
import SchedulePostingTimes from "./SchedulePostingTimes";
import SelectGroups from "./SelectGroups";

const steps = [
  {
    label: "Connect Your WhatsApp Account",
    component: <ConnectToWhatsapp />,
  },
  {
    label: "Select Your Groups",
    component: <SelectGroups />,
  },
  {
    label: "Create Your Post",
    component: <CreatePost />,
  },
  {
    label: "Set Your Schedule",
    component: <SchedulePostingTimes />,
  },
];

export default async function Settngs({
  searchParams,
}: {
  searchParams: { step: string };
}) {
  const { step } = await searchParams;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Settings
      </Typography>

      <Stepper activeStep={parseInt(step)} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>{step.component}</StepContent>
          </Step>
        ))}
      </Stepper>
    </Container>
  );
}
