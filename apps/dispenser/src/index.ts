import prisma from "@repo/db";

async function processPayouts() {
  const events = await prisma.event.findMany({
    where: {
      endTime: {
        lt: new Date(),
      },
    },
  });

  for (let event of events) {
    const stockBalances = await prisma.stockBalance.findMany({
      where: {
        eventId: event.id,
      },
    });
    const winner = event.winner;
    for (let stockBalance of stockBalances) {
      let qty = 0;
      if (winner == "YES") {
        qty = stockBalance.yesQty;
      } else {
        qty = stockBalance.noQty;
      }
      // process the payout
      // update the user balance
      await prisma.user.update({
        where: {
          id: stockBalance.userId,
        },
        data: {
          balance: {
            increment: 10 * qty,
          },
        },
      });
    }

    // update that eventpayout done
    await prisma.event.update({
      where: {
        id: event.id,
      },
      data: {
        payoutDone: true,
      },
    });
    console.log("payout done for event", event.id);
  }
}

processPayouts();
