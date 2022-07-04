import { useCallback, useContext, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
} from "@mui/material";
import { FleetBuilderContext } from "../../../../../../contexts/FactionBuilderContext.context";
import {
  ArrowUpwardRounded,
  ArrowDownwardRounded,
  ExpandMoreRounded,
} from "@mui/icons-material";
import "./ActionCards.component.css";
import { ActionCardEnum } from "../../../../../../../../ti4/enums/ActionCard.enum";

export const ActionCards = () => {
  const [
    isActionCardsSectionExpanded,
    setIsActionCardSectionExpanded,
  ] = useState(false);
  const context = useContext(FleetBuilderContext);

  const handleActionCardsSectionExpansionChange = useCallback(
    (_: React.SyntheticEvent<Element, Event>, expanded: boolean) => {
      setIsActionCardSectionExpanded(expanded);
    },
    []
  );

  const handleAddActionCard = useCallback(
    (actionCardEnum: ActionCardEnum) => {
      context?.addActionCard(actionCardEnum);
    },
    [context]
  );

  const handleRemoveActionCard = useCallback(
    (actionCardEnum: ActionCardEnum) => {
      context?.removeActionCard(actionCardEnum);
    },
    [context]
  );

  if (!context) {
    return null;
  }

  return (
    <Accordion
      expanded={isActionCardsSectionExpanded}
      onChange={handleActionCardsSectionExpansionChange}
    >
      <AccordionSummary expandIcon={<ExpandMoreRounded />}>
        <Typography>Action Cards</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {Array.from(context.actionCards).map(([actionCardEnum, count]) => {
          return (
            <div className="action-card__container" key={actionCardEnum}>
              <Typography className="action-card__title">
                {actionCardEnum}
              </Typography>
              <IconButton
                onClick={() => handleAddActionCard(actionCardEnum)}
                color="success"
                disabled={!context.areActionCardsAvailable(actionCardEnum)}
              >
                <ArrowUpwardRounded />
              </IconButton>
              <Typography>{count}</Typography>
              <IconButton
                onClick={() => handleRemoveActionCard(actionCardEnum)}
                color="error"
                disabled={count === 0}
              >
                <ArrowDownwardRounded />
              </IconButton>
            </div>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};
