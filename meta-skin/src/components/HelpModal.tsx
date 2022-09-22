import { useEffect, useState } from "react";

import { CheckCircle, Email, ThumbUpAlt } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

import { useAppStateContext } from "contexts";

function getHasAcceptedTerms() {
  return localStorage.getItem("accepted-terms") === "true";
}

export default function HelpModal() {
  const { openHelpModal, setOpenHelpModal } = useAppStateContext();

  const [hasAccepted, setHasAccepted] = useState(getHasAcceptedTerms());

  useEffect(() => {
    if (!hasAccepted) {
      setOpenHelpModal(true);
    }
  }, [hasAccepted, setOpenHelpModal]);

  const handleAcceptTerms = () => {
    localStorage.setItem("accepted-terms", "true");
    setHasAccepted(true);
    setOpenHelpModal(false);
  };

  return (
    <Dialog
      open={openHelpModal}
      onClose={() => {
        if (!getHasAcceptedTerms()) {
          toast.info(
            "You must either accept the terms or leave the site to continue",
          );
          return;
        }
        setOpenHelpModal(false);
      }}
      sx={{ "& .MuiPaper-root": { width: "95vw", maxWidth: "850px" } }}
    >
      <DialogTitle variant="h5" textAlign="center">
        📑 Terms & Conditions
      </DialogTitle>
      <DialogContent
        sx={{ paddingBottom: 0, maxWidth: "750px", margin: "auto" }}
      >
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="start"
          className="gap-2 w-full overflow-auto"
        >
          <Typography variant="h6" sx={{ paddingTop: 2 }}>
            🤔 What is this website for?
          </Typography>
          <Typography>
            Meta Apps can be referred to Friends by Advocates who own it.
            Friends get 25% discount, whilst Advocates get some credit. The
            purpose of this website is to provide some matchmaking to help all
            sides get the best out of it.
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: 2 }}>
            🔨 How to use this website?
          </Typography>
          <Typography>
            - As a Friend, search for a desired game and click on the Get icon
            to get the discount, then buy the game within 7 days.
          </Typography>
          <Typography>
            - As an Advocate, create your first link with the + button, and then
            search for other games you own and add them quickly from the table
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: 2 }}>
            🤓 Are there any limits?
          </Typography>
          <Typography>
            The confirmed regions so far are UK, ES, KR, NL and some US states.
          </Typography>
          <Typography>
            - As a Friend, once you have accepted an invitation, you have 7 days
            to buy the game.
          </Typography>
          <Typography>
            - As an Advocate, you will receive your credit 15 days after your
            Friend has bought the game (to avoid refunds).
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: 2 }}>
            😥 What data do you store?
          </Typography>
          <Typography>
            Your browser stores locally whether you have accepted these terms or
            not.
          </Typography>
          <Typography>
            - As an Advocate, a simple Database stores your `username` and a
            list of the meta apps that you have saved. You can request this
            information to be deleted by sending an email via the following
            link:
          </Typography>
          <Link href="mailto:david.c.iglesias@gmail.com?subject=[Meta App Referrals] Please remove my username!&body=Hi, my username is: [write your username here] and I would like it removed from your Meta App Referrals App.Thank you.">
            <IconButton>
              <Email />
            </IconButton>
            david.c.iglesias@gmail.com
          </Link>
          <Typography>
            - As an Advocate, your id is saved once you save a link, to thwart
            attempts of saving links from someone else.
          </Typography>
          <Typography>
            - As a Friend, the App ids you have clicked on are saved, but you
            can reset this from the Get column. Whenever you click on a link you
            go directly to the Meta Oculus Store, no strings attached.
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: 2 }}>
            💸 Where is the profit?
          </Typography>
          <Typography>
            There is no profit here, at least for us! We simply hope to help
            everyone win (more apps sold, more people getting discounts and more
            people getting credit)
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: 2 }}>
            🙏 What do I agree to?
          </Typography>
          <Typography>As a User, you agree to the following:</Typography>
          <Typography>- Not tampering with the lottery process</Typography>
          <Typography>
            - Not using/sharing any of the referral links outside of this App
          </Typography>
          <Typography>
            - Not saving any of referral links in the App outside of your own
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          className="flex w-full items-center justify-center py-4"
        >
          <Button
            startIcon={hasAccepted ? <CheckCircle /> : <ThumbUpAlt />}
            variant="contained"
            color="secondary"
            onClick={handleAcceptTerms}
            disabled={getHasAcceptedTerms()}
          >
            <Typography variant="button">
              {hasAccepted ? "You have already accepted" : "I accept the terms"}
            </Typography>
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
